{ python2, libtool, writeShellScript, writeTextFile, runCommand, pkgs, fetchurl, fetchgit, nix-gitignore, lib, stdenv, nodejs, fetchFromGitHub, makeWrapper}:

let
  nodeEnv = import ./node-env.nix {
        python2 = python2;
        libtool = libtool;
        pkgs = pkgs;
        runCommand = runCommand;
        writeTextFile = writeTextFile;
        writeShellScript = writeShellScript;
    inherit nodejs;
    lib = lib;
    stdenv = stdenv;
  };

  nodeDependencies = (import ./node-packages.nix {
        nodeEnv = nodeEnv;
    lib = lib;
    stdenv = stdenv;
    fetchurl = fetchurl;
    fetchgit = fetchgit;
    nix-gitignore = nix-gitignore;
  }).nodeDependencies;
in

stdenv.mkDerivation rec {
  pname = "hours";
  version = "0.0.0";

  src = fetchFromGitHub {
    owner = "hacke2man";
    repo = "hours";
    rev = "aa4bd276420b9d884d855904eae1f6e174f26562";
    sha256 = "sha256-cx+ptIFmvtYNuRiJNAQX7Iv7Sm0vxGTrGuCLtn/SH34=";
  };

  nativeBuildInputs = [ nodejs makeWrapper ];

  configurePhase = ''
    export HOME=$(mktemp -d)
    ln -sf ${nodeDependencies}/lib/node_modules ./node_modules
    export PATH="${nodeDependencies}/bin:$PATH"
  '';

  buildPhase = ''
    npm install
    npm run build
  '';

  installPhase = ''
    mkdir -p $out/bin
    install -Dm755 dist/hours-linux $out/bin/hours
  '';

  meta = with lib; {
    description = "markdown hours summarizer/pdf maker";
    homepage = "https://github.com/hacke2man/hours";
    license = licenses.mit;
    platforms = [ "x86_64-linux" ];
  };
}
