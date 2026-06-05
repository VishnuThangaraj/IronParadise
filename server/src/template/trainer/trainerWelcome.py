from src.template.baseTemplate import BaseTemplate

class TrainerTemplate:
    @staticmethod
    def welcome(trainer_name: str, email: str, specialization: str, shift_time: str, mobile: str):
        content = f"""
            <h2>Welcome to the Team, {trainer_name}!</h2>
            <p>We are absolutely thrilled to welcome you as a trainer at <strong>IronParadise</strong>. Your expertise will be an invaluable asset to our members.</p>
            
            <div class="highlight-box">
                <h3>Your Registered Details</h3>
                <ul>
                    <li><strong>Full Name</strong><span>{trainer_name}</span></li>
                    <li><strong>Email Address</strong><span>{email}</span></li>
                    <li><strong>Phone Number</strong><span>{mobile}</span></li>
                    <li><strong>Specialization</strong><span>{specialization}</span></li>
                    <li><strong>Assigned Shift</strong><span>{shift_time}</span></li>
                </ul>
                <div class="clear"></div>
            </div>
            
            <p>We expect you to bring your A-game and help our members crush their fitness goals! Please report to the administration desk on your first day.</p>
            <p>If any of the details above are incorrect, please contact the administration immediately.</p>
            <br>
            <p>Let's get to work,<br><strong>The IronParadise Administration</strong></p>
        """
        return {
            "subject": f"Welcome to IronParadise, {trainer_name}! 🏋️‍♂️",
            "body": BaseTemplate.get_base_html("Welcome Trainer", content)
        }
