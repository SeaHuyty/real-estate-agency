/**
 * Models Index - Database Model Relationships
 *
 * This file imports all database models and defines their Sequelize associations.
 * Associations establish foreign key constraints, support cascading deletes,
 * and enable eager loading for complex queries.
 *
 * Model Relationships:
 * - Property: hasMany PropertyImages, hasOne Amenity, hasMany VisitRequests
 * - PropertyImages: belongsTo Property
 * - Amenity: belongsTo Property
 * - VisitRequest: belongsTo Property, belongsTo Customer
 * - Customer: hasMany VisitRequests
 * - Employee: hasOne EmployeeAuth
 * - EmployeeAuth: belongsTo Employee
 * - Log: standalone model for logging
 *
 * Business Rules:
 * - Deleting a Property cascades to its images, amenities, and visit requests.
 * - Each VisitRequest is linked to a Customer and a Property.
 * - Each Employee has a single EmployeeAuth record for authentication.
 *
 * @author Real Estate Agency Team
 * @version 1.0.0
 */

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