import { City } from './city.model';
import { State } from './state.model';
import { Country } from './country.model';

export interface ProviderModel {
    provider_id: number;
    name: string;
    description: string;
    address: string;
    provider_code: number;
    provider_type: ProviderType;
    city: City;
    state: State;
    country: Country;
}

export interface ProviderType {
    provider_type: string;
    provider_type_id: number;
}
