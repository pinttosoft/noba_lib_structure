# Cual es la responsabilidad de este proyecto?

Este proyecto es una libreria **nodejs** que tiene toda la estructura y logica de negocios
de noba.cash.

### Consideraciones importantes

Actualmente noba.cash consume la API de Layer2 y es importante entender los siguientes aspecots:

- **Applications** es lo que en noba.cash llamamos onboarding de clientes que creara una cuenta una vez aprobado el onboarding.
- **Custmer** en layer2 es la persona o empresa que fue acepto en el proceso de onboarding y que es due#a de la cuenta bancaria. 
Que para noba.cash son los clientes; los clientes pueden ser clientes due#o de una cuenta propia o de una cuenta segregada.
**SI NUESTRO CLIENTE QUIERE APLICAR A UNA CUENTA INDIVIDUAL, pero no tiene ITIN**. se le crea una cuenta segregada, el due#o
- **Account** Seria lo que llamamos wallet. importante que al momento que en a API de Layer2 se llama al endpoint  v1/accounts/deposits 
(endpoint para crear lo que llama layer2 account) en seguida se debe llamar al endpoint v1/deposits para obtener la direccion de pago
en caso de critpos o las referencias de la cuenta en caso de wallet fiat.