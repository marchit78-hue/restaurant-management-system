const Feedback = require('../models/Feedback');
const Order = require('../models/Order');

// ==========================================
// SUBMIT CUSTOMER FEEDBACK
// ==========================================

const submitFeedback = async (req, res) => {
  try {
    const {
      orderId,
      rating,
      comment,
    } = req.body;

    // Authentication check
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: 'Please login before submitting feedback.',
      });
    }

    if (!orderId || rating === undefined || rating === null) {
      return res.status(400).json({
        message: 'Order ID and rating are required.',
      });
    }

    const numericRating = Number(rating);

    // Validate rating
    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: 'Rating must be between 1 and 5 stars.',
      });
    }

    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found.',
      });
    }

    // Make sure this order belongs to the logged-in customer
    if (
      String(order.customerId) !== String(req.user.id)
    ) {
      return res.status(403).json({
        message: 'You cannot review this order.',
      });
    }

    // Feedback is allowed only after the order is confirmed
    const allowedStatuses = [
      'Confirmed',
      'Preparing',
      'Ready',
      'Completed',
    ];

    if (!allowedStatuses.includes(order.status)) {
      return res.status(400).json({
        message:
          'Feedback can only be submitted after the order is confirmed.',
      });
    }

    // Prevent duplicate feedback
    const existingFeedback = await Feedback.findOne({
      orderId,
    });

    if (existingFeedback) {
      return res.status(400).json({
        message:
          'Feedback has already been submitted for this order.',
      });
    }

    // Save the food items from the original order
    const feedbackItems = order.items.map((item) => ({
      foodItem: item.foodItem,
      sizeCategory: item.sizeCategory,
      quantity: item.quantity,
    }));

    const feedback = await Feedback.create({
      orderId,
      customerId: String(req.user.id),
      customerName: order.customerName,
      items: feedbackItems,
      rating: numericRating,
      comment:
        typeof comment === 'string'
          ? comment.trim().slice(0, 1000)
          : '',
    });

    res.status(201).json({
      message:
        'Thank you! Your feedback has been submitted.',
      feedback,
    });
  } catch (error) {
    console.error('Submit feedback error:', error);

    res.status(500).json({
      message: 'Unable to submit feedback.',
    });
  }
};

// ==========================================
// GET ALL FEEDBACK — ADMIN ONLY
// ==========================================

const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .sort({ createdAt: -1 });

    res.status(200).json(feedback);
  } catch (error) {
    console.error('Get feedback error:', error);

    res.status(500).json({
      message: 'Unable to load feedback.',
    });
  }
};

// ==========================================
// GET MY FEEDBACK — CUSTOMER
// ==========================================

const getMyFeedback = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: 'Please login first.',
      });
    }

    const feedback = await Feedback.find({
      customerId: String(req.user.id),
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(feedback);
  } catch (error) {
    console.error(
      'Get customer feedback error:',
      error
    );

    res.status(500).json({
      message: 'Unable to load your feedback.',
    });
  }
};

// ==========================================
// GET FOOD-WISE RATING SUMMARY — ADMIN ONLY
// ==========================================

const getFoodRatings = async (req, res) => {
  try {
    const feedback = await Feedback.find();

    const foodRatings = {};

    feedback.forEach((review) => {
      review.items.forEach((item) => {
        const foodName = item.foodItem;

        if (!foodRatings[foodName]) {
          foodRatings[foodName] = {
            foodItem: foodName,
            totalRatings: 0,
            totalStars: 0,
            averageRating: 0,
          };
        }

        foodRatings[foodName].totalRatings += 1;
        foodRatings[foodName].totalStars += review.rating;
      });
    });

    const result = Object.values(foodRatings).map(
      (item) => ({
        ...item,
        averageRating:
          item.totalRatings > 0
            ? Number(
                (
                  item.totalStars /
                  item.totalRatings
                ).toFixed(1)
              )
            : 0,
      })
    );

    result.sort(
      (a, b) =>
        b.averageRating - a.averageRating
    );

    res.status(200).json(result);
  } catch (error) {
    console.error('Food ratings error:', error);

    res.status(500).json({
      message: 'Unable to load food ratings.',
    });
  }
};

module.exports = {
  submitFeedback,
  getAllFeedback,
  getMyFeedback,
  getFoodRatings,
};