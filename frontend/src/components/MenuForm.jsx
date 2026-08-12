const MenuForm = ({ formData, onChange, onSubmit, editingId, onCancel }) => {
  return (
    <form onSubmit={onSubmit} className="row g-3 mb-4">
      <div className="col-md-4">
        <label htmlFor="foodName" className="form-label">Food Name</label>
        <input
          type="text"
          className="form-control"
          id="foodName"
          name="foodName"
          value={formData.foodName}
          onChange={onChange}
          required
        />
      </div>

      <div className="col-md-4">
        <label htmlFor="sizeCategory" className="form-label">Size Category</label>
        <input
          type="text"
          className="form-control"
          id="sizeCategory"
          name="sizeCategory"
          value={formData.sizeCategory}
          onChange={onChange}
          required
        />
      </div>

      <div className="col-md-3">
        <label htmlFor="price" className="form-label">Price</label>
        <input
          type="number"
          className="form-control"
          id="price"
          name="price"
          min="0"
          value={formData.price}
          onChange={onChange}
          required
        />
      </div>

      <div className="col-md-1 d-flex align-items-end">
        <button type="submit" className="btn btn-primary w-100">
          {editingId ? 'Save' : 'Add'}
        </button>
      </div>

      {editingId && (
        <div className="col-12">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel Edit
          </button>
        </div>
      )}
    </form>
  );
};

export default MenuForm;
