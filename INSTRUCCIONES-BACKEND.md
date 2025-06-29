# INSTRUCCIONES PARA ACTUALIZAR TU BACKEND

## PASO 1: Actualizar ReservaController.java

Reemplaza el contenido de tu archivo ReservaController.java con este código:

```java
package com.proyecto.backend.controller;

import com.proyecto.backend.model.Reserva;
import com.proyecto.backend.model.Ruta;
import com.proyecto.backend.repository.ReservaRepository;
import com.proyecto.backend.repository.RutaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
public class ReservaController {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private RutaRepository rutaRepository;

    @PostMapping
    public Reserva reservarRuta(@RequestBody Reserva reserva) {
        Ruta ruta = rutaRepository.findById(reserva.getRuta().getId())
                .orElseThrow(() -> new RuntimeException("Ruta no encontrada"));
        reserva.setRuta(ruta);
        return reservaRepository.save(reserva);
    }

    // NUEVO ENDPOINT PARA OBTENER RESERVAS POR RUTA
    @GetMapping("/ruta/{rutaId}")
    public List<Reserva> obtenerReservasPorRuta(@PathVariable Long rutaId) {
        return reservaRepository.findByRutaId(rutaId);
    }

    // ENDPOINT PARA OBTENER TODAS LAS RESERVAS
    @GetMapping
    public List<Reserva> obtenerTodasLasReservas() {
        return reservaRepository.findAll();
    }
}
```

## PASO 2: Verificar que tu ReservaRepository.java tenga el método findByRutaId

Tu archivo ReservaRepository.java debería verse así:

```java
package com.proyecto.backend.repository;

import com.proyecto.backend.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByRutaId(Long rutaId);
}
```

## PASO 3: Reiniciar tu aplicación backend

1. Detén tu aplicación Spring Boot si está corriendo
2. Guarda los cambios en los archivos
3. Ejecuta tu aplicación nuevamente

## PASO 4: Probar los endpoints

Después de reiniciar, deberías poder usar estos endpoints:

- POST /api/reservas (crear reserva)
- GET /api/reservas/ruta/{rutaId} (obtener reservas de una ruta específica)
- GET /api/reservas (obtener todas las reservas)

## PASO 5: Probar en tu frontend

Una vez actualizado el backend, ve a tu aplicación web:
1. Haz clic en "Ver Rutas"
2. Selecciona una ruta
3. Ingresa un nombre y haz clic en "Reservar"
4. Haz clic en "Ver Reservas" para ver las reservas de esa ruta

¡Eso es todo! Tu sistema de reservas estará completamente funcional.
