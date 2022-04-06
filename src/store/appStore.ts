import {defineStore} from 'pinia'

interface AppState {
    title: string
    apiUrl: string
}

export const useAppStore = defineStore('appStore', {
        state: () => ({
            // @ts-ignore
            title: '超市会员系统',
            // @ts-ignore
            apiUrl: 'https://cs.api.keker.ink',
        }),
        actions: {
            setTitle (title: string) {
                this.title = title
            },
            clearAppStore () {
                this.reset()
            }
        }
    }
)

