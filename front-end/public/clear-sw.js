if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(async (registrations) => {
        if (!registrations.length) return;
        await Promise.all(registrations.map((registration) => registration.unregister()));
        window.location.reload();
    });
}
