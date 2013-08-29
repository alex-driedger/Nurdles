//
//  AFAppDelegate.m
//  OAuth2Example
//
//  Created by Lucas Gladding on 8/27/13.
//  Copyright (c) 2013 Apps Factory. All rights reserved.
//

#import <OAuth2Client/NXOAuth2.h>

#import "AFAppDelegate.h"

#import "NSString+AFURLAdditions.h"

@implementation AFAppDelegate

+ (void)initialize
{
    [[NXOAuth2AccountStore sharedStore] setClientID:@"abc123"
                                             secret:@"ssh-secret"
                                   authorizationURL:[NSURL URLWithString:@"http://localhost:3000/dialog/authorize"]
                                           tokenURL:[NSURL URLWithString:@"http://localhost:3000/oauth/token"]
                                        redirectURL:[NSURL URLWithString:@"pattern://authenticate"]
                                     forAccountType:AFPatternAccountType];
}

// Authentication here is done through an external application (i.e. Safari).
// Upon completion, the server redirects, including either an access code or an error.
// Per OAuth2, the authorization code should then be exchanged for an access token.
- (void)authenticate
{
    [[NXOAuth2AccountStore sharedStore] requestAccessToAccountWithType:AFPatternAccountType];
}

// Authentication here is done using the password grant type. The server response contains the access token.
- (void)authenticateWithUsername:(NSString *)username password:(NSString *)password
{
    [[NXOAuth2AccountStore sharedStore] requestAccessToAccountWithType:AFPatternAccountType
                                                              username:username
                                                              password:password];
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation
{
    NSDictionary *query = [[url query] parsedQueryString];
    NSString *code = [query valueForKey:@"code"];
    NSString *error = [query valueForKey:@"error"];
    
    NSLog(@"Received response with code: %@, error: %@", code, error);
    
    return YES;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    // Override point for customization after application launch.
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
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

@end
