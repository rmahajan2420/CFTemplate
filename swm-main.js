{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Description": "SWM Parent Template for Stack Creation",
  "Resources": {
    "VPCChildStack01": {
      "Type": "AWS::CloudFormation::Stack",
      "Properties": {
        "TemplateURL": "https://s3-ap-southeast-2.amazonaws.com/swm-cf/swm-vpc.js",
        "TimeoutInMinutes": "60"
      }
    },
    "SubnetsSGNACLChildStack02": {
      "DependsOn": ["VPCChildStack01"],
      "Type": "AWS::CloudFormation::Stack",
      "Properties": {
        "TemplateURL": "https://s3-ap-southeast-2.amazonaws.com/swm-cf/swm-subnets-network-security.js",
        "Parameters": {
          "swmVPC": {
            "Fn::GetAtt": ["VPCChildStack01", "Outputs.VPCID"]
          }
        },
        "TimeoutInMinutes": "60"
      }
    },
    "RouteTablesChildStack03": {
      "DependsOn": ["SubnetsSGNACLChildStack02"],
      "Type": "AWS::CloudFormation::Stack",
      "Properties": {
        "TemplateURL": "https://s3-ap-southeast-2.amazonaws.com/swm-cf/swm-RouteTable.js",
        "Parameters": {
          "swmVPC": {
            "Fn::GetAtt": ["VPCChildStack01", "Outputs.VPCID"]
          },
          "InternetGateway": {
            "Fn::GetAtt": ["VPCChildStack01", "Outputs.InternetgatewayID"]
          },
          "Tier0PublicSubnetAZ2a": {
            "Fn::GetAtt": ["SubnetsSGNACLChildStack02", "Outputs.Tier0PublicSubnetAZ2a"]
          }
        },
        "TimeoutInMinutes": "60"
        }
      },
       
        "InstancesChildStack04": {
        "DependsOn": ["RouteTablesChildStack03"],
           "Type": "AWS::CloudFormation::Stack",
           "Properties": {
            "TemplateURL": "https://s3-ap-southeast-2.amazonaws.com/swm-cf/swm-buildEC2",
            "Parameters": {
            "Tier0PublicSubnetAZ2a": {
              "Fn::GetAtt": ["SubnetsSGNACLChildStack02", "Outputs.Tier0PublicSubnetAZ2a"]
            },
            "Tier0PublicSubnetAZ2b": {
              "Fn::GetAtt": ["SubnetsSGNACLChildStack02", "Outputs.Tier0PublicSubnetAZ2b"]
            },
            "SecurityGroupIdTier0": {
              "Fn::GetAtt": ["SubnetsSGNACLChildStack02", "Outputs.Tier0SG"]
            },
            "Tier0SG": {
              "Fn::GetAtt": ["SubnetsSGNACLChildStack02", "Outputs.Tier0SG"]
               }
            },
          "TimeoutInMinutes": "60"
           }
        }
      },
           "Outputs" : {
      
       }
}