//
//  NSString+AFURLAdditions.m
//  OAuth2Example
//
//  Created by Lucas Gladding on 8/27/13.
//  Copyright (c) 2013 Apps Factory. All rights reserved.
//

#import "NSString+AFURLAdditions.h"

@implementation NSString (AFURLAdditions)

- (NSDictionary *)parsedQueryString
{
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];
    for (NSString *component in [self componentsSeparatedByString:@"&"]) {
        NSArray *pair = [component componentsSeparatedByString:@"="];
        if (pair.count == 2) {
            [dict setValue:pair[1] forKey:pair[0]];
        }
    }
    return dict;
}

@end
