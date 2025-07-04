import Amenity from "./Amenity.model.js";
import Customer from "./Customer.model.js";
import Employee from "./Employee.model.js";
import EmployeeAuth from "./EmployeeAuth.model.js";
import Log from "./Log.model.js";
import Property from "./Property.model.js";
import PropertyImages from "./PropertyImages.model.js";
import VisitRequest from "./VisitRequest.model.js";

// Property Relations
Property.hasMany(PropertyImages, { foreignKey: 'property_id', as: 'images', onDelete: 'CASCADE' });
Property.hasOne(Amenity, { foreignKey: 'property_id', as: 'amenities', onDelete: 'CASCADE' });
Property.hasMany(VisitRequest, { foreignKey: 'property_id', as: 'visit_requests', onDelete: 'CASCADE' });

// PropertyImages & Amenity Back-Refs
Amenity.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });
PropertyImages.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });

// Visit Request Relations
VisitRequest.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });
VisitRequest.belongsTo(Customer, { foreignKey: 'user_id', as: 'customer' });

// Customer Relations
Customer.hasMany(VisitRequest, { foreignKey: 'user_id', as: 'visit_requests' });

// Employee Auth
Employee.hasOne(EmployeeAuth, { foreignKey: 'employee_id', as: 'auth' });
EmployeeAuth.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

export {
    Property,
    PropertyImages,
    Amenity,
    Customer,
    VisitRequest,
    Employee,
    EmployeeAuth,
    Log
};