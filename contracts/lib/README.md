# Contract Integration Library

These files should be imported by the frontend to interact with the smart contracts.

## Files

- **addresses.ts** - Contract addresses by chain ID
- **hooks.ts** - React hooks for ethers.js integration

## Usage in Frontend

The frontend should import these files and the compiled artifacts:

```typescript
// Import hooks from contracts
import { useFactoryContract } from '../../contracts/lib/hooks';

// Import ABIs from contracts artifacts
import MultisigFactoryABI from '../../contracts/artifacts/contracts/MultisigFactory.sol/MultisigFactory.json';
```

## Note

When deploying contracts, the `deploy.ts` script automatically creates a `.env.local` file in the frontend directory with the factory address.
