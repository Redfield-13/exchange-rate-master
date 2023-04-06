import {IExecuteFunctions,} from 'n8n-core';

import {
	IDataObject,INodeExecutionData,INodeType,INodeTypeDescription,} from 'n8n-workflow';

// Main Class
export class ExchangeRate implements INodeType {
    description: INodeTypeDescription = {
      displayName: 'Exchange Rate',
      name: 'exchangeRate',
      icon: 'file:exchangeRate.svg',
      group: ['input'],
      version: 1,
      description: 'Fetch exchange rates for specified currencies',
      defaults: {
        name: 'Exchange Rate',
        color: '#00adee',
      },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [],
    properties: [
        {
          displayName: 'Base Currency',
          name: 'base',
          type: 'string',
          default: 'USD',
          required: true,
          description: 'The base currency to convert from.',
        },
        {
          displayName: 'Target Currency',
          name: 'target',
          type: 'string',
          default: 'EUR',
          required: true,
          description: 'The target currency to convert to.',
        },
      ],
    }
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const length = items.length as unknown as number;
        const responseData: IDataObject[] = [];
    
        for (let i = 0; i < length; i++) {
          const base = this.getNodeParameter('base', i) as string;
          const target = this.getNodeParameter('target', i) as string;
    
          const apiUrl = `https://www.freeforexapi.com/api/live?pairs=${base}${target}`;
          const response = await this.helpers.request({ method: 'GET', url: apiUrl, json: true });
    
          const exchangeRate = response.rates[`${base}${target}`].rate;
    
          responseData.push({ base, target, exchangeRate });
        }
    
        return this.prepareOutputData(responseData.map((item) => ({ json: item })));
      }
    }