export interface ProviderListModel {
    provider_uuid: string,
    name: string,
    provider_first_name: string,
    provider_last_name: string,
    provider_type_id: number,
    status: number,
    is_active: number,
    created_at: string,
    user: user,
    city: city,
    state: state,
    country: country
}

export interface user {
    user_id: number,
    email: string
}

export interface city {
    city_id: number,
    city_name: string
}

export interface state {
    state_id: number,
    state_name: string
}

export interface country {
    country_id: number,
    country_name: string,
}
