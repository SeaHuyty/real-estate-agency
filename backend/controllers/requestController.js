import { sql } from '../config/db.js';

export const createRequest = async (req, res) => {
    const { userId, propertyId, preferredDate, notes } = req.body;
    try {
        const newRequest = await sql`
            INSERT INTO visit_requests (user_id, property_id, preferred_date, notes)
            VALUES (${userId}, ${propertyId}, ${preferredDate}, ${notes})
            RETURNING *;
        `;
        res.status(201).json({ success: true, data: newRequest[0] });
    } catch (error) {
        console.error('Error in createRequest:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllRequests = async (req, res) => {
    try {
        const requests = await sql`
            SELECT r.*, p.title as property_title, u.name as user_name
            FROM visit_requests r
            LEFT JOIN properties p ON r.property_id = p.id
            LEFT JOIN customers u ON r.user_id = u.id
            ORDER BY r.created_at DESC;
        `;
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
        const updatedRequest = await sql`
            UPDATE visit_requests
            SET status = ${status}, assigned_agency_id = ${assignedAgencyId}, notes = ${notes}
            WHERE id = ${id}
            RETURNING *;
        `;
        if (updatedRequest.length === 0) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }
        res.status(200).json({ success: true, data: updatedRequest[0] });
    } catch (error) {
        console.error('Error in updateRequest:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};