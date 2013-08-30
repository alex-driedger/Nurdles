//
//  AFViewController.m
//  OAuth2Example
//
//  Created by Lucas Gladding on 8/27/13.
//  Copyright (c) 2013 Apps Factory. All rights reserved.
//

#import <OAuth2Client/NXOAuth2.h>

#import "AFViewController.h"

#import "AFAppDelegate.h"


static NSString *AFOAuthAccessTokenKey = @"AFOAuthAccessTokenKey";


@interface AFViewController ()

@end


@implementation AFViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    self.errorLabel.text = @"";
    self.usernameTextField.text = @"appsfactory";
    self.passwordTextField.text = @"appsfactory";

    NSNotificationCenter *nc = [NSNotificationCenter defaultCenter];
    [nc addObserverForName:NXOAuth2AccountStoreAccountsDidChangeNotification
                    object:[NXOAuth2AccountStore sharedStore]
                     queue:nil
                usingBlock:^(NSNotification *notif) {
                    
                    // Obtain the token from the notification.
                    NXOAuth2Account *account = [[[NXOAuth2AccountStore sharedStore] accountsWithAccountType:AFPatternAccountType] firstObject];
                    NSString *token = account.accessToken.accessToken;
                    
                    // Store the token in the user defaults.
                    [[NSUserDefaults standardUserDefaults] setObject:token forKey:AFOAuthAccessTokenKey];
                    
                    // Perform the login segue.
                    [self performSegueWithIdentifier:@"login" sender:self];

                }];
    
    [nc addObserverForName:NXOAuth2AccountStoreDidFailToRequestAccessNotification
                    object:nil
                     queue:0
                usingBlock:^(NSNotification *note) {
                    
                    self.errorLabel.text = @"Error logging in.";
                    
                }];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)authenticateWithCredentialsAction:(id)sender
{
    self.errorLabel.text = @"";
    
    AFAppDelegate *delegate = [[UIApplication sharedApplication] delegate];
    
    [delegate authenticateWithUsername:self.usernameTextField.text password:self.passwordTextField.text];
}

@end
