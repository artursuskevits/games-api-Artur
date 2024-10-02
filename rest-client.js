const vue = Vue.createApp({
    data() {
        return {
            gameInModal: { name: null, price: 0 },
            games: [], // This will hold the data fetched from the API
            newGame: { name: '', price: 0 }, // Form input for a new game
            updatedGame: { id: null, name: '', price: 0 },// Data for updating a game
            gameToDelete: null,
        };
    },
    async created() {
        // Fetch games from the API when the component is created
        await this.fetchGames();
    },
    methods: {
        showDeleteModal(gameId) {
            this.gameToDelete = gameId; // Set the game to be deleted
            const deleteModal = new bootstrap.Modal(document.getElementById('deleteGameModal'));
            deleteModal.show(); // Show the modal
        },
        closeDeleteModal() {
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteGameModal'));
            deleteModal.hide(); // Close the modal
            this.gameToDelete = null; // Reset game to delete
        },
        confirmDelete() {
            this.deleteGame(this.gameToDelete); // Call delete method
            this.closeDeleteModal(); // Close the modal after deletion
        },
        deleteGame(gameId) {
            // Your logic to delete the game, e.g., an API call
            console.log(`Deleting game with ID: ${gameId}`);
            // Remove game from the games array for UI update
            this.games = this.games.filter(game => game.id !== gameId);
        },
        // Fetch the games from the API
        async fetchGames() {
            try {
                const response = await fetch('http://localhost:8080/games'); // Update the API endpoint if necessary
                if (!response.ok) {
                    throw new Error('Failed to fetch games');
                }
                this.games = await response.json(); // Bind the response to `games`
            } catch (error) {
                console.error('Error fetching games:', error);
            }
        },
        // Fetch details of a specific game
        async getGame(id) {
            try {
                const response = await fetch(`http://localhost:8080/games/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch game details');
                }
                this.gameInModal = await response.json();
                const gameInfoModal = new bootstrap.Modal(document.getElementById('gameInfoModal'));
                gameInfoModal.show();
            } catch (error) {
                console.error('Error fetching game details:', error);
            }
        },
        // Show the modal to add a new game
        showAddGameModal() {
            const addGameModal = new bootstrap.Modal(document.getElementById('addGameModal'));
            addGameModal.show();
        },
        // Add a new game to the list
        async addGame() {
            try {
                await fetch('http://localhost:8080/games', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.newGame)
                });
                this.newGame = { name: '', price: 0 }; // Reset form
                await this.fetchGames(); // Reload the games list
                this.closeModal(); // Close the modal
            } catch (error) {
                console.error('Error adding game:', error);
            }
        },
        // Show the modal to update a game
        showUpdateGameModal(game) {
            this.updatedGame = { ...game }; // Copy the game data
            const updateGameModal = new bootstrap.Modal(document.getElementById('updateGameModal'));
            updateGameModal.show();
        },
        // Update the game in the API
        async updateGame() {
            try {
                await fetch(`http://localhost:8080/games/${this.updatedGame.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.updatedGame)
                });
                await this.fetchGames(); // Reload the games list after the update
                this.closeModal(); // Close the modal
            } catch (error) {
                console.error('Error updating game:', error);
            }
        },
        // Delete a game from the API
        async deleteGame(id) {
            try {
                await fetch(`http://localhost:8080/games/${id}`, {
                    method: 'DELETE'
                });
                await this.fetchGames();
            } catch (error) {
                console.error('Error deleting game:', error);
            }
        }
        ,
        // Close any open modal
        closeModal() {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => bootstrap.Modal.getInstance(modal)?.hide());
        }
    }
});

vue.mount('#app');
