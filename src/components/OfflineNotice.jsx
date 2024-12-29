export const OfflineNotice = () => {
    return (
        <div class="min-h-screen bg-gray-100 flex items-center justify-center">
            <div class="bg-white p-8 rounded-lg shadow-xl max-w-sm text-center">
                <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 13l4 4L10 9M21 13l-4 4-4-4"></path>
                </svg>
                <h2 class="text-2xl font-semibold text-gray-700 mb-4">No estás en línea</h2>
                <p class="text-gray-500 mb-6">Parece que no tienes conexión a Internet. Revisa tu conexión.</p>
            </div>
        </div>
    )
}