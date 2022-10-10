
export enum ProviderStatusEnum {
    PROFILE_NOT_COMPLETED = 1,
    PENDING = 2,
    APPROVED = 3,
    REJECTED = 4
};

export const ProviderStatusList = [
    {id: ProviderStatusEnum.PROFILE_NOT_COMPLETED, status: 'Profile Not Completed'},
    {id: ProviderStatusEnum.PENDING, status: 'Pending'},
    {id: ProviderStatusEnum.APPROVED, status: 'Approved'},
    {id: ProviderStatusEnum.REJECTED, status: 'Rejected'}
]

export enum ProviderTypeEnum {
    SCHOOL = 1,
    COLLEGE = 2,
    INSTITUTE = 3,
    TUITION =4
};

export const ProviderTypeList = [
    {id: ProviderTypeEnum.SCHOOL, value: 'School'},
    {id: ProviderTypeEnum.COLLEGE, value: 'College'},
    {id: ProviderTypeEnum.INSTITUTE, value: 'Institute'},
    {id: ProviderTypeEnum.TUITION, value: 'Tuition'}
]
