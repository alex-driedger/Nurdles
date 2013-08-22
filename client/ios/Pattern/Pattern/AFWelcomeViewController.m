//
//  AFWelcomeViewController.m
//  Pattern
//
//  Created by Lucas Gladding on 8/22/13.
//  Copyright (c) 2013 Apps Factory. All rights reserved.
//

#import "AFWelcomeViewController.h"

#import "AFAppDelegate.h"

@interface AFWelcomeViewController ()

@end

@implementation AFWelcomeViewController

- (void)viewDidLoad
{
    [super viewDidLoad];

    AFAppDelegate *appDelegate = [[UIApplication sharedApplication] delegate];
    [appDelegate authenticate];
}

- (IBAction)handleLogoutAction:(id)sender
{
    AFAppDelegate *appDelegate = [[UIApplication sharedApplication] delegate];
    [appDelegate unauthenticate];
}

@end
