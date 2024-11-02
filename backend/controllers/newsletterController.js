import Newsletter from '../models/newsletterModel.js';
import { validateEmail } from '../utils/validation.js';
import { sendNewsletter } from '../utils/emailService.js';

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed to our newsletter'
      });
    }

    // Create new subscriber
    const newSubscriber = new Newsletter({
      email,
      subscribedAt: new Date()
    });

    await newSubscriber.save();

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to the newsletter'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your subscription'
    });
  }
};

export const sendNewsToSubscribers = async (req, res) => {
  try {
    const { subject, content } = req.body;

    // Validate input
    if (!subject || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both subject and content'
      });
    }

    // Get all active subscribers
    const subscribers = await Newsletter.find({ isActive: true })
      .select('email');
    
    const subscriberEmails = subscribers.map(sub => sub.email);

    if (subscriberEmails.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active subscribers found'
      });
    }

    // Send the newsletter
    await sendNewsletter(subscriberEmails, subject, content);

    res.status(200).json({
      success: true,
      message: `Newsletter sent successfully to ${subscriberEmails.length} subscribers`
    });

  } catch (error) {
    console.error('Send newsletter error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send newsletter',
      error: error.message
    });
  }
};