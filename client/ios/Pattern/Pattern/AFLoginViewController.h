//
//  AFViewController.h
//  Pattern
//
//  Created by Lucas Gladding on 8/22/13.
//  Copyright (c) 2013 Apps Factory. All rights reserved.
//

#import <UIKit/UIKit.h>

#import "AFConnectionManager.h"

@interface AFLoginViewController : UIViewController <AFConnectionManagerDelegate>

@property (weak, nonatomic) IBOutlet UITextField *URLTextField;
@property (weak, nonatomic) IBOutlet UITextField *usernameTextField;
@property (weak, nonatomic) IBOutlet UITextField *passwordTextField;
@property (weak, nonatomic) IBOutlet UILabel *statusLabel;

- (IBAction)handleLoginAction:(id)sender;

@end
