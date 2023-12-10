# Generate confirme email template
def generate_confirme_email(link, name):
    content = f'''
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Email Confirmation</title>
            </head>
            <body style="font-family: Arial, sans-serif; margin: 20px">
                <div style="width: 100%">
                    <h2 style="text-align: center; padding: 10px 0px; background: #4caf50; color: #fff">Email Confirmation</h2>

                    <p>Dear user, {name}</p>

                    <p>
                        Thank you for registering. Please click the button below to confirm your
                        email:
                    </p>
                    <div style="display: flex; align-items: center; justify-content: center; width: 100%; padding: 20px;">
                        <a
                            href="{link}"
                            style="
                                display: inline-block;
                                padding: 10px 20px;
                                background-color: #4caf50;
                                color: white;
                                text-decoration: none;
                                border-radius: 5px;
                            "
                            >Confirm Email</a>
                        <p>
                    </div>
                        If the button doesn't work, you can also click the following link:
                        <a href="{link}">{link}</a>
                    </p>

                    <p>Best regards,<br />AstringAI</p>
                </div>
            </body>
        </html>
    '''
    return content