import { RequestApi } from '.'

export const getRelationSearch = async (params) =>
    await new RequestApi()
        .setUrl('http://localhost:3001/xxx')
        .withAuth()
        .get(params) // TODO url外置
