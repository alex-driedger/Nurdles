//
//  AFViewController.h
//  OAuth2Example
//
//  Created by Lucas Gladding on 8/27/13.
//  Copyright (c) 2013 Apps Factory. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface AFViewController : UIViewController

@property (nonatomic, weak) IBOutlet UILabel *errorLabel;
@property (nonatomic, weak) IBOutlet UITextField *usernameTextField;
@property (nonatomic, weak) IBOutlet UITextField *passwordTextField;

- (IBAction)authenticateWithCredentialsAction:(id)sender;
- (IBAction)authenticateAction:(id)sender;

@end
