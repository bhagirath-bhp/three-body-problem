(function() {
    // Function to get memory usage
    function getMemoryUsage() {
        if (performance.memory) {
            return performance.memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
        } else {
            console.warn("Performance.memory is not supported.");
            return null;
        }
    }

    // Initial memory usage
    let initialMemory = getMemoryUsage();
    console.log(`Initial memory usage: ${initialMemory} MB`);

    // Monitor memory usage at regular intervals
    setInterval(function() {
        let currentMemory = getMemoryUsage();
        if (currentMemory !== null) {
            console.log(`Current memory usage: ${currentMemory} MB`);
            
            // Log a warning if memory usage increases significantly
            if (currentMemory - initialMemory > 10) { // Adjust threshold as needed
                console.warn(`Potential memory leak detected: Memory usage increased by ${currentMemory - initialMemory} MB`);
            }

            // Update initial memory for the next interval
            initialMemory = currentMemory;
        }
    }, 6000); // Check every minute (60000 ms)
})();
