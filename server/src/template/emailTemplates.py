from src.template.baseTemplate import BaseTemplate

class EmailTemplates:

    @staticmethod
    def welcome(member_name: str):
        content = f"""
            <h2>Welcome to the Family, {member_name}!</h2>
            <p>Your membership has been activated successfully. We are absolutely thrilled to have you with us at <strong>IronParadise</strong>.</p>
            <p>Get ready to crush your fitness goals with our state-of-the-art equipment and expert trainers.</p>
            
            <div class="highlight-box">
                <h3>Quick Tips for Success</h3>
                <ul>
                    <li><strong>Check-in</strong><span>Use your registered mobile</span></li>
                    <li><strong>Assistance</strong><span>Ask our front desk anytime</span></li>
                    <li><strong>Workouts</strong><span>Follow your trainer's plan</span></li>
                </ul>
                <div class="clear"></div>
            </div>
            
            <p>Stay strong,<br><strong>The IronParadise Team</strong></p>
        """
        return {
            "subject": "Welcome to IronParadise Gym! 🏋️‍♂️",
            "body": BaseTemplate.get_base_html("Welcome", content)
        }

    @staticmethod
    def payment_success(member_name: str, amount: float):
        content = f"""
            <h2>Payment Successful</h2>
            <p>Hello <strong>{member_name}</strong>,</p>
            <p>We have successfully received your payment.</p>
            
            <div class="highlight-box">
                <h3>Transaction Details</h3>
                <ul>
                    <li><strong>Status</strong><span>Success</span></li>
                    <li><strong>Amount Paid</strong><span>₹{amount}</span></li>
                </ul>
                <div class="clear"></div>
            </div>
            
            <p>Thank you for choosing IronParadise. We appreciate your prompt payment.</p>
            <br>
            <p>Best regards,<br><strong>The IronParadise Team</strong></p>
        """
        return {
            "subject": "Payment Confirmation - IronParadise",
            "body": BaseTemplate.get_base_html("Payment Success", content)
        }