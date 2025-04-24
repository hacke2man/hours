{pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
    buildInputs = with pkgs; [
        nodejs
        pnpm
        nodePackages.vscode-json-languageserver
        typescript-language-server
    ];
    shellHook = ''
        export LSPSERVERS='jsonls,ts_ls'
        '';
}
