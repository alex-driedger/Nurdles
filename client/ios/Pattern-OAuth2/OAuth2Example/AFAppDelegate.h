//
//  AFAppDelegate.h
//  OAuth2Example
//
//  Created by Lucas Gladding on 8/27/13.
//  Copyright (c) 2013 Apps Factory. All rights reserved.
//

#import <UIKit/UIKit.h>


static NSString *AFPatternAccountType = @"Pattern";


@interface AFAppDelegate : UIResponder <UIApplicationDelegate>

@property (strong, nonatomic) UIWindow *window;

- (void)authenticateWithUsername:(NSString *)username password:(NSString *)password;

@end
