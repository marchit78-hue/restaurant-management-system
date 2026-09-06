const MenuForm = ({
  formData,
  onChange,
  onSubmit,
  editingId,
  onCancel,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="row g-3 mb-4"
    >

      {/* =========================
          FOOD NAME
      ========================== */}

      <div className="col-12 col-md-5">

        <label
          htmlFor="foodName"
          className="form-label fw-semibold"
        >
          Food Name
        </label>

        <input
          type="text"
          className="form-control"
          id="foodName"
          name="foodName"
          value={formData.foodName}
          onChange={onChange}
          placeholder="e.g. Paneer Pizza"
          required
        />

      </div>

      {/* =========================
          HALF PRICE
      ========================== */}

      <div className="col-12 col-md-3">

        <label
          htmlFor="halfPrice"
          className="form-label fw-semibold"
        >
          Half Price
        </label>

        <div className="input-group">

          <span className="input-group-text">
            ₹
          </span>

          <input
            type="number"
            className="form-control"
            id="halfPrice"
            name="halfPrice"
            min="0"
            value={formData.halfPrice}
            onChange={onChange}
            placeholder="e.g. 180"
            required
          />

        </div>

      </div>

      {/* =========================
          FULL PRICE
      ========================== */}

      <div className="col-12 col-md-3">

        <label
          htmlFor="fullPrice"
          className="form-label fw-semibold"
        >
          Full Price
        </label>

        <div className="input-group">

          <span className="input-group-text">
            ₹
          </span>

          <input
            type="number"
            className="form-control"
            id="fullPrice"
            name="fullPrice"
            min="0"
            value={formData.fullPrice}
            onChange={onChange}
            placeholder="e.g. 320"
            required
          />

        </div>

      </div>

      {/* =========================
          IMAGE
      ========================== */}

      <div className="col-12">

        <label
          htmlFor="image"
          className="form-label fw-semibold"
        >
          Food Image URL
        </label>

        <input
          type="url"
          className="form-control"
          id="image"
          name="image"
          value={formData.image}
          onChange={onChange}
          placeholder="https://image-url.com/food.jpg"
        />

        <small className="text-muted">
          Add one image for this food item.
        </small>

      </div>

      {/* =========================
          PRICE PREVIEW
      ========================== */}

      <div className="col-12">

        <div className="alert alert-light border mb-0">

          <strong>
            Price Preview:
          </strong>

          <div className="d-flex flex-wrap gap-4 mt-2">

            <span>
              🥣 <strong>Half:</strong>{' '}
              ₹
              {formData.halfPrice || '0'}
            </span>

            <span>
              🍽️ <strong>Full:</strong>{' '}
              ₹
              {formData.fullPrice || '0'}
            </span>

          </div>

        </div>

      </div>

      {/* =========================
          BUTTONS
      ========================== */}

      <div className="col-12 d-flex gap-2">

        <button
          type="submit"
          className="btn btn-primary"
        >
          {editingId
            ? 'Save Changes'
            : 'Add Menu Item'}
        </button>

        {editingId && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel Edit
          </button>
        )}

      </div>

    </form>
  );
};

export default MenuForm;
