//
//  AFAppDelegate.h
//  Pattern
//
//  Created by Lucas Gladding on 8/22/13.
//  Copyright (c) 2013 Apps Factory. All rights reserved.
//

#import <UIKit/UIKit.h>

#define AFAuthenticationTokenKey @"AFAuthenticationTokenKey"

@interface AFAppDelegate : UIResponder <UIApplicationDelegate>

@property (strong, nonatomic) UIWindow *window;

- (void)authenticate;
- (void)unauthenticate;

@end
