//
//  AFAppDelegate.m
//  Pattern
//
//  Created by Lucas Gladding on 8/22/13.
//  Copyright (c) 2013 Apps Factory. All rights reserved.
//

#import "AFAppDelegate.h"

#import "AFLoginViewController.h"

@interface AFAppDelegate ()

- (void)presentLoginView;

@end

@implementation AFAppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    // Override point for customization after application launch.
    
    // Register the user defaults.
    NSDictionary *defaults = @{};
    [[NSUserDefaults standardUserDefaults] registerDefaults:defaults];
    
    return YES;
}
							
- (void)applicationWillResignActive:(UIApplication *)application
{
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later. 
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    
    // Authentication.
    [self authenticate];
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

#pragma mark - Authentication

- (void)authenticate
{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *token = [defaults valueForKey:AFAuthenticationTokenKey];
    
    // Check whether the authentication token exists.
    if (!token) {
        [self presentLoginView];
    }
}

- (void)unauthenticate
{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    [defaults removeObjectForKey:AFAuthenticationTokenKey];
    
    [self presentLoginView];
}

- (void)presentLoginView
{
    UIViewController *navigationController = (UINavigationController *)self.window.rootViewController;
    [navigationController performSegueWithIdentifier:@"login" sender:self];
}

@end
