const vue = Vue.createApp({
    data() {
        return {
            gameInModal: {name: null},
            games: [],
            newGame: {name: '', price: 0}
        }
    },
    async created() {
        this.fetchGames();
    },
    methods: {
        async fetchGames() {
            this.games = await (await fetch('http://localhost:8080/games')).json();
        },
        getGame: async function(id) {
            this.gameInModal = await (await fetch(`http://localhost:8080/games/${id}`)).json();
            let gameInfoModal = new bootstrap.Modal(document.getElementById('gameInfoModal'), {});
            gameInfoModal.show();
        },
        closeModal() {
            let modals = document.querySelectorAll('.modal.show');
            modals.forEach(modal => bootstrap.Modal.getInstance(modal).hide());
        },
        showAddGameModal() {
            let addGameModal = new bootstrap.Modal(document.getElementById('addGameModal'), {});
            addGameModal.show();
        },
        async addGame() {
            await fetch('http://localhost:8080/games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.newGame)
            });
            this.newGame = {name: '', price: 0};
            this.fetchGames();
            this.closeModal();
        },
        async deleteGame(id) {
            await fetch(`http://localhost:8080/games/${id}`, {
                method: 'DELETE'
            });
            this.fetchGames();
        }
    }
}).mount('#app');