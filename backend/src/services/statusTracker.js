import { OrderStatusHistory } from '../models/index.js';

class StatusTracker {
  static async recordStatusChange(orderId, previousStatus, newStatus, notes = null) {
    try {
      const statusHistory = await OrderStatusHistory.create({
        orderId,
        previousStatus,
        newStatus,
        changedAt: new Date(),
        notes
      });

      return statusHistory;
    } catch (error) {
      console.error('Error recording status change:', error);
      throw new Error('Failed to record status change');
    }
  }

  static async getOrderStatusHistory(orderId) {
    try {
      const history = await OrderStatusHistory.findAll({
        where: { orderId },
        order: [['changedAt', 'ASC']],
        attributes: [
          'id',
          'previousStatus',
          'newStatus',
          'changedAt',
          'notes',
          'createdAt'
        ]
      });

      return history;
    } catch (error) {
      console.error('Error fetching status history:', error);
      throw new Error('Failed to fetch status history');
    }
  }

  static async getLatestStatusChange(orderId) {
    try {
      const latestChange = await OrderStatusHistory.findOne({
        where: { orderId },
        order: [['changedAt', 'DESC']],
        attributes: [
          'id',
          'previousStatus',
          'newStatus',
          'changedAt',
          'notes'
        ]
      });

      return latestChange;
    } catch (error) {
      console.error('Error fetching latest status change:', error);
      throw new Error('Failed to fetch latest status change');
    }
  }

  static getStatusChangeDescription(previousStatus, newStatus) {
    if (!previousStatus) {
      return `Order created with initial status: ${newStatus}`;
    }

    const descriptions = {
      'Pending->In Transit': 'Package picked up and in transit to destination',
      'In Transit->Delivered': 'Package successfully delivered to recipient',
      'Pending->Canceled': 'Order was canceled before pickup',
      'In Transit->Canceled': 'Order was canceled during transit',
      'Pending->Delivered': 'Package delivered directly (express delivery)',
      'Delivered->In Transit': 'Package returned to transit (delivery failed)',
      'Canceled->Pending': 'Canceled order was reinstated'
    };

    const key = `${previousStatus}->${newStatus}`;
    return descriptions[key] || `Status changed from ${previousStatus} to ${newStatus}`;
  }

  static async getStatusTimeline(orderId) {
    try {
      const history = await this.getOrderStatusHistory(orderId);
      
      return history.map((entry, index) => ({
        id: entry.id,
        status: entry.newStatus,
        previousStatus: entry.previousStatus,
        timestamp: entry.changedAt,
        description: this.getStatusChangeDescription(entry.previousStatus, entry.newStatus),
        notes: entry.notes,
        isInitial: !entry.previousStatus,
        stepNumber: index + 1,
        icon: this.getStatusIcon(entry.newStatus),
        color: this.getStatusColor(entry.newStatus)
      }));
    } catch (error) {
      console.error('Error getting status timeline:', error);
      throw new Error('Failed to get status timeline');
    }
  }

  static getStatusIcon(status) {
    const icons = {
      'Pending': 'clock',
      'In Transit': 'truck',
      'Delivered': 'check-circle',
      'Canceled': 'x-circle'
    };
    return icons[status] || 'circle';
  }

  static getStatusColor(status) {
    const colors = {
      'Pending': 'yellow',
      'In Transit': 'blue',
      'Delivered': 'green',
      'Canceled': 'red'
    };
    return colors[status] || 'gray';
  }

  static isValidStatusTransition(currentStatus, newStatus) {
    if (currentStatus === newStatus) {
      return false;
    }

    const validTransitions = {
      'Pending': ['In Transit', 'Delivered', 'Canceled'],
      'In Transit': ['Delivered', 'Canceled'],
      'Delivered': [],
      'Canceled': []
    };

    const allowedTransitions = validTransitions[currentStatus] || [];
    return allowedTransitions.includes(newStatus);
  }
}

export default StatusTracker; 