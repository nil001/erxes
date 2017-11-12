import mongoose from 'mongoose';
import { MESSENGER_KINDS, SENT_AS_CHOICES, METHODS } from '../../data/constants';
import { field } from './utils';

const EmailSchema = mongoose.Schema({
  templateId: field({ type: String }),
  subject: field({ type: String }),
  content: field({ type: String }),
});

const RuleSchema = mongoose.Schema({
  _id: field({ type: String }),

  // browserLanguage, currentUrl, etc ...
  kind: field({ type: String }),

  // Browser language, Current url etc ...
  text: field({ type: String }),

  // is, isNot, startsWith
  condition: field({ type: String }),

  value: field({ type: String }),
});

const MessengerSchema = mongoose.Schema({
  brandId: field({ type: String }),
  kind: field({
    type: String,
    enum: MESSENGER_KINDS.ALL,
  }),
  sentAs: field({
    type: String,
    enum: SENT_AS_CHOICES.ALL,
  }),
  content: field({ type: String }),
  rules: field({ type: [RuleSchema] }),
});

const EngageMessageSchema = mongoose.Schema({
  _id: field({ pkey: true }),
  kind: field({ type: String }),
  segmentId: field({ type: String }),
  customerIds: field({ type: [String] }),
  title: field({ type: String }),
  fromUserId: field({ type: String }),
  method: field({
    type: String,
    enum: METHODS.ALL,
  }),
  isDraft: field({ type: Boolean }),
  isLive: field({ type: Boolean }),
  stopDate: field({ type: Date }),
  createdDate: field({ type: Date }),
  tagIds: field({ type: [String] }),
  messengerReceivedCustomerIds: field({ type: [String] }),

  email: field({ type: EmailSchema }),
  messenger: field({ type: MessengerSchema }),
  deliveryReports: field({ type: Object }),
});

class Message {
  /**
   * Create engage message
   * @param {Object} doc object
   * @return {Promise} Newly created message object
   */
  static createEngageMessage(doc) {
    return this.create({
      ...doc,
      deliveryReports: {},
      createdUserId: doc.userId,
      createdDate: new Date(),
    });
  }

  /**
   * Update engage message
   * @param {String} _id - Engage message id
   * @param {Object} doc object
   * @return {Promise} updated message object
   */
  static async updateEngageMessage(_id, doc) {
    await this.update({ _id }, { $set: doc });

    return this.findOne({ _id });
  }

  /**
   * Engage message set live
   * @param {String} _id - Engage message id
   * @return {Promise} updated message object
   */
  static async engageMessageSetLive(_id) {
    await this.update({ _id }, { $set: { isLive: true, isDraft: false } });

    return this.findOne({ _id });
  }

  /**
   * Engage message set pause
   * @param {String} _id - Engage message id
   * @return {Promise} updated message object
   */
  static async engageMessageSetPause(_id) {
    await this.update({ _id }, { $set: { isLive: false } });

    return this.findOne({ _id });
  }

  /**
   * Remove engage message
   * @param {String} _id - Engage message id
   * @return {Promise}
   */
  static async removeEngageMessage(_id) {
    const messageObj = await this.findOne({ _id });

    if (!messageObj) throw new Error(`Engage message not found with id ${_id}`);

    return messageObj.remove();
  }

  /**
   * Save matched customer ids
   * @param {String} _id - Engage message id
   * @param {[Object]} customers - Customers object
   * @return {Promise} updated message object
   */
  static async setCustomerIds(_id, customers) {
    await this.update({ _id }, { $set: { customerIds: customers.map(customer => customer._id) } });

    return this.findOne({ _id });
  }

  /**
   * Add new delivery report
   * @param {String} _id - Engage message id
   * @param {String} mailMessageId - Random mail message id
   * @param {String} customerId - Customer id
   * @return {Promise} updated message object
   */
  static async addNewDeliveryReport(_id, mailMessageId, customerId) {
    await this.update(
      { _id },
      {
        $set: {
          [`deliveryReports.${mailMessageId}`]: {
            customerId,
            status: 'pending',
          },
        },
      },
    );

    return this.findOne({ _id });
  }

  /**
   * Change delivery report status
   * @param {String} _id - Engage message id
   * @param {String} mailMessageId - Random mail message id
   * @param {String} status - pending, send, failed etc...
   * @return {Promise} updated message object
   */
  static async changeDeliveryReportStatus(_id, mailMessageId, status) {
    await this.update(
      { _id },
      {
        $set: {
          [`deliveryReports.${mailMessageId}.status`]: status,
        },
      },
    );

    return this.findOne({ _id });
  }
}

EngageMessageSchema.loadClass(Message);
const EngageMessages = mongoose.model('engage_messages', EngageMessageSchema);

export default EngageMessages;
