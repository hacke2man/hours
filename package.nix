{ stdenv, fetchurl }:

stdenv.mkDerivation rec {
  pname = "hours";
  version = "1.0";

  src = fetchurl {
    url = "https://example.com/path/to/binary";
    sha256 = "0000000000000000000000000000000000000000000000000000"; # You'll replace this
  };

  phases = [ "installPhase" ];

  installPhase = ''
    mkdir -p $out/bin
    cp $src $out/bin/my-binary
    chmod +x $out/bin/my-binary
  '';

  meta = with stdenv.lib; {
    description = "timesheet summery/pdf creation";
    homepage = "";
    license = licenses.unfree;
    platforms = platforms.all;
  };
}
