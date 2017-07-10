import {GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString} from 'graphql';
import * as path from 'path';
import {loadProxyConfig} from '../../../src/config/load-config';
import {ProxyConfig} from "../../../src/config/proxy-configuration";
import {testTypes} from "../../helpers/test-types";

export async function getConfig() {
    return <ProxyConfig>{
        endpoints: [
            {
                namespace: 'staticData',
                url: "http://localhost:1337/graphql",
                typePrefix: 'CountryNS'
            },
            {
                schema: new GraphQLSchema({
                    query: new GraphQLObjectType({
                        name: 'Query',
                        fields: {
                            horst: {
                                type: testTypes.personType,
                                resolve: () => ({nationality: 'DE', name: "Horst"})
                            },
                            allPeople: {
                                type: new GraphQLList(testTypes.personType),
                                resolve: () => ([
                                    {nationality: 'DE', name: "Horst"},
                                    {nationality: 'DE', name: "Helga"},
                                    {nationality: 'FR', name: "Jacqueline"}])
                            }
                        }
                    })
                }),
                fieldMetadata: {
                    "Person.nationality": {
                        "link": {
                            "field": "staticData.allCountries",
                            "argument": "filter.identCode_in",
                            "keyField": "identCode",
                            "batchMode": true
                        }
                    }
                }
            }
        ],
        port: 3100
    };
}