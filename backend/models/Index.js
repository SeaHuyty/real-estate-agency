import Amenity from "./Amenity.js";
import Customer from "./Customer.js";
import Employee from "./Employee.js";
import EmployeeAuth from "./EmployeeAuth.js";
import Log from "./Log.js";
import Property from "./Property.js";
import PropertyImages from "./PropertyImages.js";
import VisitRequest from "./VisitRequest.js";

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