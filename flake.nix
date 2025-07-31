{
  description = "Logistics Tracking App - Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Node.js ecosystem
            nodejs_20
            pnpm
            
            # Database tools
            postgresql
            
            # Container tools
            docker
            docker-compose
            
            # Development utilities
            git
            curl
            jq
          ];

          shellHook = ''
            echo "🚚 Logistics Tracking App Development Environment"
            echo "Node.js version: $(node --version)"
            echo "pnpm version: $(pnpm --version)"
            echo "PostgreSQL client version: $(psql --version)"
            echo "Docker version: $(docker --version)"
            echo ""
            echo "To get started:"
            echo "  pnpm install     # Install dependencies"
            echo "  pnpm dev         # Start development servers"
          '';
        };
      });
} 