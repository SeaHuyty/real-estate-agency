import { Customer, Property, VisitRequest, PropertyImages } from '../models/Index.js';

export const createRequest = async (req, res) => {
    const { userId, propertyId, preferredDate, notes } = req.body;
    try {
        const newRequest = await VisitRequest.create({
            user_id: userId,
            property_id: propertyId,
            preferred_date: preferredDate,
            notes: notes
        });
        
        res.status(201).json({ success: true, data: newRequest[0] });
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
                    attributes: ['title']
                },
                {
                    model: Customer,
                    as: 'customer',
                    attributes: ['name']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({ success: true, data: requests });
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
                    attributes: ['title', 'property_thumbnail'],
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
                    attributes: ['name']
                }
            ]
        });

        if (request.length === 0) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        res.status(200).json({ success: true, data: request[0] });
    } catch (error) {
        console.error('Error in getRequestById:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};