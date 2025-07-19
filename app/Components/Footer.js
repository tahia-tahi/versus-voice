export default function Footer() {
  return (
    <footer className="bg-gray-200 text-center py-4 mt-10">
      <p className="text-sm text-gray-600">
        &copy; {new Date().getFullYear()} VersusVoice. All rights reserved.
      </p>
    </footer>
  );
}
