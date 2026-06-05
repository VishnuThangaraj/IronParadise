class BaseTemplate:
    @staticmethod
    def get_base_html(title: str, content: str) -> str:
        return f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{title}</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
                
                body {{
                    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    background-color: #020617;
                    margin: 0;
                    padding: 0;
                    -webkit-font-smoothing: antialiased;
                }}
                .wrapper {{
                    padding: 40px 20px;
                    width: 100%;
                    box-sizing: border-box;
                    background: linear-gradient(180deg, #020617 0%, #0f172a 50%, #1e1b4b 100%);
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #0f172a;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    border: 1px solid #1e293b;
                }}
                .header {{
                    background: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%);
                    padding: 35px 30px;
                    text-align: center;
                }}
                .header h1 {{
                    margin: 0;
                    color: #ffffff;
                    font-size: 32px;
                    font-weight: 800;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                }}
                .header h1 span {{
                    font-weight: 300;
                    opacity: 0.9;
                }}
                .content {{
                    padding: 40px 30px;
                    color: #cbd5e1;
                    line-height: 1.8;
                    font-size: 16px;
                }}
                .content h2 {{
                    color: #f8fafc;
                    font-size: 26px;
                    margin-top: 0;
                    font-weight: 600;
                    letter-spacing: -0.5px;
                }}
                .content strong {{
                    color: #f8fafc;
                }}
                .highlight-box {{
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid #1e293b;
                    border-radius: 12px;
                    padding: 24px;
                    margin: 30px 0;
                    border-left: 4px solid #4f46e5;
                }}
                .highlight-box h3 {{
                    margin-top: 0;
                    color: #f8fafc;
                    font-size: 18px;
                    margin-bottom: 20px;
                    font-weight: 600;
                }}
                .highlight-box ul {{
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }}
                .highlight-box li {{
                    padding: 12px 0;
                    border-bottom: 1px solid rgba(51, 65, 85, 0.5);
                    color: #94a3b8;
                    font-size: 15px;
                }}
                .highlight-box li:last-child {{
                    border-bottom: none;
                    padding-bottom: 0;
                }}
                .highlight-box li span {{
                    color: #f8fafc;
                    font-weight: 600;
                    float: right;
                }}
                .clear {{ clear: both; }}
                .footer {{
                    background-color: #020617;
                    padding: 24px;
                    text-align: center;
                    color: #64748b;
                    font-size: 14px;
                    border-top: 1px solid #1e293b;
                    letter-spacing: 0.5px;
                }}
                .footer strong {{
                    color: #94a3b8;
                }}
            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="container">
                    <div class="header">
                        <h1>Iron<span>Paradise</span></h1>
                    </div>
                    <div class="content">
                        {content}
                    </div>
                    <div class="footer">
                        &copy; 2026 <strong>IronParadise Gym</strong>.<br>
                        Unleash your potential.
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
