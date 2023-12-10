from datetime import datetime, timezone

def get_uname(email):
    # Split the email address at the "@" symbol
    username, domain = email.split('@', 1)

    # If the username contains dots, split it at the first dot
    if '.' in username:
        first_name = username.split('.', 1)[0]
    else:
        # If no dots are found, use the entire username as the first name
        first_name = username
        
    unique_time = ''.join(str(datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")).split('-'))
    unique_time = ''.join(unique_time.split(':'))
    return first_name + unique_time
