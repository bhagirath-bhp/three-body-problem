import * as THREE from 'three';

export class Body {
    constructor(radius, mass, color, position) {
        this.radius = radius;
        this.mass = mass;
        this.color = color;
        this.shape = new THREE.SphereGeometry(this.radius, 32, 32);
        this.material = new THREE.MeshBasicMaterial({ color: this.color });
        this.position = position || new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.mesh = null;
    }

    create() {
        this.mesh = new THREE.Mesh(this.shape, this.material);
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        return this.mesh;
    }

    updatePosition(newPosition) {
        this.position = newPosition;
        this.mesh.position.set(newPosition.x, newPosition.y, newPosition.z);
    }
}

export class Physics {
    constructor(boundingBoxSize = 10) {
        this.bodies = [];
        this.boundingBoxSize = boundingBoxSize;
        this.boundingBoxHalfSize = boundingBoxSize / 2;
    }

    addBody(body) {
        this.bodies.push(body);
    }

    removeBody(body) {
        const index = this.bodies.indexOf(body);
        if (index > -1) {
            this.bodies.splice(index, 1);
        }
    }

    update(delta) {
        const G = 0.1; // Gravitational constant

        // Update body positions based on velocity
        this.bodies.forEach(body => {
            const newPosition = body.position.clone().add(body.velocity.clone().multiplyScalar(delta));
            body.updatePosition(newPosition);
        });

        // Handle collisions
        this.bodies.forEach(body => {
            if (this.checkBoundingBoxCollision(body)) {
                this.handleBoundingBoxCollision(body);
            }
        });

        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = i + 1; j < this.bodies.length; j++) {
                if (this.checkBodyCollision(this.bodies[i], this.bodies[j])) {
                    this.handleBodyCollision(this.bodies[i], this.bodies[j]);
                }
            }
        }

        // Update velocities based on gravitational forces
        for (let i = 0; i < this.bodies.length; i++) {
            const body = this.bodies[i];
            for (let j = 0; j < this.bodies.length; j++) {
                if (i !== j) {
                    const otherBody = this.bodies[j];
                    const direction = otherBody.position.clone().sub(body.position);
                    const distance = direction.length();
                    if (distance > 0) {
                        const force = G * body.mass * otherBody.mass / Math.pow(distance, 2);
                        const acceleration = force / body.mass;
                        body.velocity.add(direction.normalize().multiplyScalar(acceleration * delta));
                    }
                }
            }
        }
    }

    checkBoundingBoxCollision(body) {
        const pos = body.position;
        return (
            Math.abs(pos.x) + body.radius > this.boundingBoxHalfSize ||
            Math.abs(pos.y) + body.radius > this.boundingBoxHalfSize ||
            Math.abs(pos.z) + body.radius > this.boundingBoxHalfSize
        );
    }

    handleBoundingBoxCollision(body) {
        console.log("bounding box collision");
        
        // Determine the axis of collision
        const threshold = 0.1; // Small threshold to avoid jittering
        let collided = false;
    
        if (Math.abs(body.position.x) + body.radius > this.boundingBoxHalfSize) {
            body.velocity.x *= -0.8; // More realistic bounce
            collided = true;
        }
        if (Math.abs(body.position.y) + body.radius > this.boundingBoxHalfSize) {
            body.velocity.y *= -0.8;
            collided = true;
        }
        if (Math.abs(body.position.z) + body.radius > this.boundingBoxHalfSize) {
            body.velocity.z *= -0.8;
            collided = true;
        }
    
        // If there's a collision, move the body back inside the bounding box
        // if (collided) {
        //     const correction = new THREE.Vector3(
        //         Math.sign(body.position.x) * (body.radius + this.boundingBoxHalfSize - Math.abs(body.position.x)),
        //         Math.sign(body.position.y) * (body.radius + this.boundingBoxHalfSize - Math.abs(body.position.y)),
        //         Math.sign(body.position.z) * (body.radius + this.boundingBoxHalfSize - Math.abs(body.position.z))
        //     );
        //     body.position.add(correction);
        //     body.updatePosition(body.position); // Update mesh position
        // }
    }
    
    

    checkBodyCollision(body1, body2) {
        const distance = body1.position.distanceTo(body2.position);
        return distance < (body1.radius + body2.radius);
    }

    handleBodyCollision(body1, body2) {
        const normal = body2.position.clone().sub(body1.position).normalize();
        const relativeVelocity = body2.velocity.clone().sub(body1.velocity);
        const velocityAlongNormal = relativeVelocity.dot(normal);
    
        // Only process if bodies are moving towards each other
        if (velocityAlongNormal > 0) return;
    
        const restitution = 0.8; // Coefficient of restitution
        const impulseMagnitude = (2 * velocityAlongNormal) / (body1.mass + body2.mass);
        const impulse = normal.clone().multiplyScalar(impulseMagnitude);
    
        // Apply impulse to both bodies
        body1.velocity.add(impulse.clone().multiplyScalar(-body1.mass));
        body2.velocity.add(impulse.clone().multiplyScalar(body2.mass));
    
        // Optional: Correct positions to prevent bodies from interpenetrating
        // Here we can add some positional correction to handle overlap
    }
    
    
}
