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
    
    self.usernameTextField.text = @"bob";
    self.passwordTextField.text = @"secret";

    NSNotificationCenter *nc = [NSNotificationCenter defaultCenter];
    [nc addObserverForName:NXOAuth2AccountStoreAccountsDidChangeNotification
                    object:[NXOAuth2AccountStore sharedStore]
                     queue:nil
                usingBlock:^(NSNotification *notif) {
                    
                    // NSLog(@"NXOAuth2AccountStoreAccountsDidChangeNotification: %@", notif);
                    
                    // Obtain the access token from the notification.
                    NXOAuth2Account *account = [[[NXOAuth2AccountStore sharedStore] accountsWithAccountType:AFPatternAccountType] firstObject];
                    NSString *token = account.accessToken.accessToken;
                    
                    // Store the token in the user defaults.
                    [[NSUserDefaults standardUserDefaults] setObject:token forKey:AFOAuthAccessTokenKey];
                    
                    // Show the welcome view.
                    [self performSegueWithIdentifier:@"login" sender:self];

                }];
    [nc addObserverForName:NXOAuth2AccountDidFailToGetAccessTokenNotification
                    object:[NXOAuth2AccountStore sharedStore]
                     queue:nil
                usingBlock:^(NSNotification *notif) {
                    
                    // NSLog(@"NXOAuth2AccountDidFailToGetAccessTokenNotification: %@", notif);
                    
                    // Remove the previous token from the user defaults.
                    [[NSUserDefaults standardUserDefaults] removeObjectForKey:AFOAuthAccessTokenKey];
    
                }];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)authenticateWithCredentialsAction:(id)sender
{
    AFAppDelegate *delegate = [[UIApplication sharedApplication] delegate];
    
    [delegate authenticateWithUsername:self.usernameTextField.text password:self.passwordTextField.text];
}

- (IBAction)authenticateAction:(id)sender
{
    AFAppDelegate *delegate = [[UIApplication sharedApplication] delegate];
    
    [delegate authenticate];
}

@end
