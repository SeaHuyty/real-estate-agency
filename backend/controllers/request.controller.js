import { Customer, Property, VisitRequest, PropertyImages } from '../models/Index.js';

export const createRequest = async (req, res) => {
    const { propertyId, preferredDate, notes } = req.body;
    const userId = req.user.id; // Get user ID from JWT token

    try {
        // Validate required fields
        if (!propertyId || !preferredDate) {
            return res.status(400).json({
                success: false,
                message: 'Property ID and Preferred Date are required'
            });
        }

        // Validate that the property exists
        const property = await Property.findByPk(propertyId);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Validate that the customer exists (should exist since they're authenticated)
        const customer = await Customer.findByPk(userId);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        const newRequest = await VisitRequest.create({
            user_id: userId,
            property_id: propertyId,
            preferred_date: preferredDate,
            notes: notes || null,
            status: 'pending'
        });

        res.status(201).json({ success: true, data: newRequest });
    } catch (error) {
        console.error('Error in createRequest:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllRequests = async (req, res) => {
    try {
        const requests = await VisitRequest.findAll({
            include: [
                {
                    model: Property,
                    as: 'property',
                    attributes: ['title', 'address', 'property_thumbnail']
                },
                {
                    model: Customer,
                    as: 'customer',
                    attributes: ['name', 'email', 'phone']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        // Transform the data to match frontend expectations
        const transformedRequests = requests.map(request => {
            const requestData = request.toJSON();
            return {
                id: requestData.id,
                user_id: requestData.user_id,
                property_id: requestData.property_id,
                preferred_date: requestData.preferred_date,
                status: requestData.status,
                assigned_agency_id: requestData.assigned_agency_id,
                notes: requestData.notes,
                created_at: requestData.created_at,
                // Flatten property data
                property_title: requestData.property?.title || 'Unknown Property',
                property_address: requestData.property?.address || null,
                property_thumbnail: requestData.property?.property_thumbnail || null,
                // Flatten customer data
                user_name: requestData.customer?.name || 'Unknown User',
                user_email: requestData.customer?.email || null,
                user_phone: requestData.customer?.phone || null
            };
        });

        res.status(200).json({ success: true, data: transformedRequests });
    } catch (error) {
        console.error('Error in getAllRequests:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateRequest = async (req, res) => {
    const { id } = req.params;
    const { status, assignedAgencyId, notes } = req.body;
    
    try {
        // Convert empty string to null for assigned_agency_id
        const agencyId = assignedAgencyId === '' ? null : assignedAgencyId;
        
        // Count is the number of row affected, updateRequest is the value we get from { returning: true }
        const [count, updatedRequest] = await VisitRequest.update({
            status: status,
            assigned_agency_id: agencyId,
            notes: notes,
        }, {
            where: { id: id },
            returning: true
        });
        
        if (count === 0) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }
        
        res.status(200).json({ success: true, data: updatedRequest[0] });
    } catch (error) {
        console.error('Error in updateRequest:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getRequestById = async (req, res) => {
    const { id } = req.params;
    try {
        const request = await VisitRequest.findOne({
            where: { id: id },
            include: [
                {
                    model: Property,
                    as: 'property',
                    attributes: ['title', 'property_thumbnail', 'address', 'description', 'price', 'property_type'],
                    include: [
                        {
                            model: PropertyImages,
                            as: 'images',
                            attributes: ['image_url']
                        }
                    ]
                }, {
                    model: Customer,
                    as: 'customer',
                    attributes: ['name', 'email', 'phone']
                }
            ]
        });

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        // Transform the data to match frontend expectations
        const requestData = request.toJSON();
        const transformedRequest = {
            id: requestData.id,
            user_id: requestData.user_id,
            property_id: requestData.property_id,
            preferred_date: requestData.preferred_date,
            status: requestData.status,
            assigned_agency_id: requestData.assigned_agency_id,
            notes: requestData.notes,
            created_at: requestData.created_at,
            // Flatten property data
            property_title: requestData.property?.title || 'Unknown Property',
            property_address: requestData.property?.address || null,
            property_thumbnail: requestData.property?.property_thumbnail || null,
            property_description: requestData.property?.description || null,
            property_price: requestData.property?.price || null,
            property_type: requestData.property?.property_type || null,
            property_images: requestData.property?.images?.map(img => img.image_url) || [],
            // Flatten customer data
            user_name: requestData.customer?.name || 'Unknown User',
            user_email: requestData.customer?.email || null,
            user_phone: requestData.customer?.phone || null
        };

        res.status(200).json({ success: true, data: transformedRequest });
    } catch (error) {
        console.error('Error in getRequestById:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteRequest = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCount = await VisitRequest.destroy({
            where: { id: id }
        });

        if (deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        res.status(200).json({ success: true, message: 'Visit request deleted successfully' });
    } catch (error) {
        console.error('Error in deleteRequest:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};