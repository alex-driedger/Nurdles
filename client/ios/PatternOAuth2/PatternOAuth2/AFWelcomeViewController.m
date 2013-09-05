//
//  AFWelcomeViewController.m
//  OAuth2Example
//
//  Created by Lucas Gladding on 8/29/13.
//  Copyright (c) 2013 Apps Factory. All rights reserved.
//

#import <OAuth2Client/NXOAuth2.h>

#import "AFWelcomeViewController.h"

#import "AFConnectionManager.h"


@interface AFWelcomeViewController ()

@end


@implementation AFWelcomeViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    
//    @todo: accounts array should be cleaned when new accounts are added.
    NSArray *accounts = [[NXOAuth2AccountStore sharedStore] accounts];
    
    [NXOAuth2Request performMethod:@"GET"
                        onResource:[NSURL URLWithString:@"http://localhost:4010/oauth/user"]
                   usingParameters:nil
                       withAccount:accounts[0]
               sendProgressHandler:0
                   responseHandler:^(NSURLResponse *response, NSData *responseData, NSError *error) {
                       
                       NSString *decoded = [[NSString alloc] initWithData:responseData encoding:NSUTF8StringEncoding];
                       
                       self.responseTextView.text = decoded;
                       
                   }];
}

@end
