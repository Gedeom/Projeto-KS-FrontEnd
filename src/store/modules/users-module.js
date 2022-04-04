const state = {
    token: null,
    id: null,
    name: null
};

const mutations = {
    LOGIN_SUCCESS(state, response) {
        console.log(response);
        console.log(state);
        state.token = response.data.token,
            state.id = response.data.user.id,
            state.nome = response.data.user.name
    }
}
console.log(state);
export default {
    state,
    mutations
}