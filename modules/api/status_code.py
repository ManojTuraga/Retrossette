'''
Title: Status Codes
Author: Ceres Botkin
Description: Class to represent and print certain status codes
'''

class StatusCode():
    msg_dict = { 200 : 'Success',
                 302 : 'Found', 
                 401 : 'Bad Token: Re-authenticate server or user',
                 403 : 'Bad OAuth Request: Check request',
                 429 : 'App Exceeded Rate Limit: Try again later' }
    
    def __init__(self, code):
        self.code = code

    def __repr__(self):
        return f'Status Code {self.code}'

    def __str__(self):
        return f'Status Code {self.code}'

    # Print status code
    def print_status_code(self):
        if (self.code in self.msg_dict):
            print(f'{self.code} - {self.msg_dict[self.code]}')
        else:
            print(f'Unkown Code: {self.code}')

    # Check if error code
    def is_error(self):
        return ((self.code // 100 == 4) or (self.code // 100 == 5)) 

    # Print error
    def print_error(self):
        print('ERROR ', end='')
        self.print_status_code()

