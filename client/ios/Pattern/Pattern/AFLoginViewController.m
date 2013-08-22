//
//  AFViewController.m
//  Pattern
//
//  Created by Lucas Gladding on 8/22/13.
//  Copyright (c) 2013 Apps Factory. All rights reserved.
//

#import "AFLoginViewController.h"

#import "AFAppDelegate.h"

@interface AFLoginViewController ()

@end

@implementation AFLoginViewController

- (void)viewDidLoad
{
    self.URLTextField.text = @"http://localhost:4010/api/user/login";
    self.usernameTextField.text = @"appsfactory";
    self.passwordTextField.text = @"appsfactory";
    self.statusLabel.text = @"";
}

- (IBAction)handleLoginAction:(id)sender
{
    // Set the headers.
    NSDictionary *headers = @{@"Content-Type": @"application/json"};
    
    // Set the request parameters.
    NSDictionary *paramaters = @{@"username": self.usernameTextField.text,
                                 @"password": self.passwordTextField.text};
    
    // Create the connection manager.
    [AFConnectionManager connectionWithURLWithString:self.URLTextField.text
                                             headers:headers
                                              method:@"POST"
                                          parameters:paramaters
                                            delegate:self];
    
    // Update the connection status.
    self.statusLabel.text = @"Connecting...";
}

#pragma mark - Connection manager delegate

- (void)manager:(AFConnectionManager *)manager didReceiveResponse:(NSHTTPURLResponse *)response data:(NSData *)data
{
    // Decode the JSON response.
    NSError *error = nil;
    NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:data options:0 error:&error];
    
    if (response.statusCode == 200) {
        // Update the access token.
        NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
        NSString *token = [dict valueForKey:@"exactEarthAuthKey"];
        [defaults setValue:token forKey:AFAuthenticationTokenKey];
        
        // Update the connection status.
        self.statusLabel.text = [NSString stringWithFormat:@"Logged in"];
        
        // Dismiss the login view.
        [self dismissViewControllerAnimated:YES completion:nil];
    
    } else {
        // Remove the access token.
        NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
        [defaults removeObjectForKey:AFAuthenticationTokenKey];
        
        // Update the connection status.
        self.statusLabel.text = @"Login failed";
    }
}

- (void)manager:(AFConnectionManager *)manager didFailWithError:(NSError *)error
{
    // Update the connection status.
    self.statusLabel.text = @"Connection failed";
}

@end
