{
    "AWSTemplateFormatVersion" : "2010-09-09",
    "Description"              : "Cloudformation creating RouteTables for the VPC",
    "Parameters"               : {
        "StackVersion" : {
            "Default" : "2016-03-05",
            "Type"    : "String",
            "Description" : ""
        },
        "EnviromentName" : {
            "Description" : "Environment type.",
            "Default"     : "swm-prod",
            "Type"        : "String",
            "AllowedValues" : [
                "swm-staging",
                "swm-prod"
            ],
            "ConstraintDescription" : "must specify : swm-staging, swm-prod"
        },
        "swmVPC"    : {
            "Default" : "vpc",
            "Type"    : "String",
            "Description" : "VCP ID "
        },
        "InternetGateway" : {
            "Default" : "igw",
            "Type"    : "String",
            "Description" : "Internet Gateway"
        },
        "Tier0PublicSubnetAZ2a"          : {
            "Default" : "subnet",
            "Type"    : "String",
            "Description" : "Tier0 Public Subnet"
        }
        
   },
    "Resources"                : {
        "Tier0PublicRouteTable2a" : {
            "Type" : "AWS::EC2::RouteTable",
            "Properties" : {
                "VpcId" : {
                    "Ref" : "swmVPC"
                },
                "Tags"  : [
                    {
                        "Key" : "Name",
                        "Value" : {
                            "Fn::Join" : [
                                "",
                                [
                                    "PublicRoueTable2a",
                                    {
                                        "Ref" : "EnviromentName"
                                    }
                                ]
                            ]
                        }
                    }
                ]
            }
        },
         "Tier0RouteTable2RouteSet2a" : {
            "Type" : "AWS::EC2::Route",
            "Properties" : {
                "GatewayId" : {
                    "Ref" : "InternetGateway"
                },
                "DestinationCidrBlock" : "0.0.0.0/0",
                "RouteTableId"         : {
                    "Ref" : "Tier0PublicRouteTable2a"
                }
            }
        },
      
        "Tier0RouteTable2AssociationSet2a" : {
            "Type" : "AWS::EC2::SubnetRouteTableAssociation",
            "Properties" : {
                "SubnetId" : {
                    "Ref" : "Tier0PublicSubnetAZ2a"
                },
                "RouteTableId" : {
                    "Ref" : "Tier0PublicRouteTable2a"
                 }
            }
        }
    }
}