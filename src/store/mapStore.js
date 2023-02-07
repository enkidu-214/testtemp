import { uavResInfo } from '../../index.d.ts'

export default {
    state: {
        mapCenter: {},


    },
    actions: {
        setMapCenter({ commit, state }, center) {
            commit('SET_MAP_CENTER', center);
        }
    },
    mutations: {
        SET_MAP_CENTER: (state, center) => {
            this.mapCenter.lat = center.lat;
            this.mapCenter.lng = center.lng;
        }
    }
}